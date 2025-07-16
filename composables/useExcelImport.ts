// composables/useExcelImport.ts
import * as XLSX from 'xlsx';
import { useApi } from '~/composables/useApi';

export interface BmClientData {
    business_name: string;
    industry: string;
    contact_person: string;
    contact: string; // phone number
    telegram_contact?: string;
    remark?: string;
    task?: string;
    facebook_link?: string;
    date_of_last_contact?: string;
}

export interface ImportResult {
    success: boolean;
    totalRecords: number;
    successfulImports: number;
    failedImports: number;
    errors: Array<{
        row: number;
        error: string;
        data?: any;
    }>;
}

export const useExcelImport = () => {
    const importing = ref(false);
    const progress = ref(0);

    // Function to read Excel file
    const readExcelFile = (file: File): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // Get the first worksheet
                    const worksheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[worksheetName];

                    // Convert to JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                        header: 1,
                        defval: ''
                    });

                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    };

    // Function to map Excel columns to your data model
    const mapExcelDataToModel = (excelData: any[]): BmClientData[] => {
        if (excelData.length < 2) {
            throw new Error('Excel file must contain headers and at least one data row');
        }

        const headers = excelData[0] as string[];
        const dataRows = excelData.slice(1);

        // Create a mapping for your columns based on the screenshot
        const columnMapping: { [key: string]: keyof BmClientData } = {
            'BUSINESS NAME': 'business_name',
            'INDUSTRY': 'industry',
            'CONTACT PERSON': 'contact_person',
            'CONTACT (PHONE NUMBER)': 'contact',
            'TELEGRAM CONTACT': 'telegram_contact',
            'REMARK': 'remark',
            'TASK': 'task',
            'FACEBOOK LINK': 'facebook_link',
            'DATE OF LAST CONTACT': 'date_of_last_contact'
        };


        // Find column indices
        const columnIndices: { [key in keyof BmClientData]?: number } = {};
        headers.forEach((header, index) => {
            const normalizedHeader = header.toString().toUpperCase().replace(/\s+/g, ' ').trim();
            const mappedField = columnMapping[normalizedHeader];
            if (mappedField) {
                columnIndices[mappedField] = index;
            }
        });

        // Convert data rows
        return dataRows.map((row: any[], rowIndex: number) => {
            const client: Partial<BmClientData> = {};

            // Map each field
            Object.entries(columnIndices).forEach(([field, colIndex]) => {
                if (colIndex !== undefined && row[colIndex] !== undefined) {
                    let value = row[colIndex]?.toString().trim() || '';

                    // Handle date formatting for date_of_last_contact
                    if (field === 'date_of_last_contact' && value) {
                        try {
                            // Handle Excel date serial numbers
                            if (!isNaN(Number(value))) {
                                const excelDate = XLSX.SSF.parse_date_code(Number(value));
                                value = `${excelDate.y}-${String(excelDate.m).padStart(2, '0')}-${String(excelDate.d).padStart(2, '0')}`;
                            }
                        } catch (error) {
                            // Keep original value if date parsing fails
                        }
                    }

                    (client as any)[field] = value || null;
                }
            });

            // Validate required fields
            // if (!client.business_name || !client.industry) {
            //     throw new Error(`Row ${rowIndex + 2}: Business name and industry are required`);
            // }

            return client as BmClientData;
        }).filter(client => client.business_name); // Filter out empty rows
    };

    // Function to import single client record
    const importSingleClient = async (clientData: BmClientData): Promise<void> => {
        try {
            await useApi('/items/bm_client', {
                method: 'POST',
                data: clientData
            });
        } catch (error: any) {
            throw new Error(`Failed to import client: ${error.response?.data?.errors?.[0]?.message || error.message}`);
        }
    };

    // Main import function
    const importFromExcel = async (file: File): Promise<ImportResult> => {
        importing.value = true;
        progress.value = 0;

        const result: ImportResult = {
            success: false,
            totalRecords: 0,
            successfulImports: 0,
            failedImports: 0,
            errors: []
        };

        try {
            // Read Excel file
            const excelData = await readExcelFile(file);

            // Map to data model
            const clientsData = mapExcelDataToModel(excelData);
            result.totalRecords = clientsData.length;

            // Import each client
            for (let i = 0; i < clientsData.length; i++) {
                try {
                    await importSingleClient(clientsData[i]);
                    result.successfulImports++;
                } catch (error: any) {
                    result.failedImports++;
                    result.errors.push({
                        row: i + 2, // +2 because Excel starts at 1 and we skip header
                        error: error.message,
                        data: clientsData[i]
                    });
                }

                // Update progress
                progress.value = Math.round(((i + 1) / clientsData.length) * 100);
            }

            result.success = result.successfulImports > 0;

        } catch (error: any) {
            result.errors.push({
                row: 0,
                error: error.message
            });
        } finally {
            importing.value = false;
            progress.value = 0;
        }

        return result;
    };

    // Batch import function for better performance
    const batchImportFromExcel = async (file: File, batchSize: number = 50): Promise<ImportResult> => {
        importing.value = true;
        progress.value = 0;

        const result: ImportResult = {
            success: false,
            totalRecords: 0,
            successfulImports: 0,
            failedImports: 0,
            errors: []
        };

        try {
            // Read Excel file
            const excelData = await readExcelFile(file);

            // Map to data model
            const clientsData = mapExcelDataToModel(excelData);
            result.totalRecords = clientsData.length;

            // Process in batches
            for (let i = 0; i < clientsData.length; i += batchSize) {
                const batch = clientsData.slice(i, i + batchSize);

                try {
                    await useApi('/items/bm_client', {
                        method: 'POST',
                        data: batch
                    });
                    result.successfulImports += batch.length;
                } catch (error: any) {
                    // If batch fails, try individual imports
                    for (let j = 0; j < batch.length; j++) {
                        try {
                            await importSingleClient(batch[j]);
                            result.successfulImports++;
                        } catch (individualError: any) {
                            result.failedImports++;
                            result.errors.push({
                                row: i + j + 2,
                                error: individualError.message,
                                data: batch[j]
                            });
                        }
                    }
                }

                // Update progress
                progress.value = Math.round(((i + batch.length) / clientsData.length) * 100);
            }

            result.success = result.successfulImports > 0;

        } catch (error: any) {
            result.errors.push({
                row: 0,
                error: error.message
            });
        } finally {
            importing.value = false;
            progress.value = 0;
        }

        return result;
    };

    return {
        importing: readonly(importing),
        progress: readonly(progress),
        importFromExcel,
        batchImportFromExcel
    };
};