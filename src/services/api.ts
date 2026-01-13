export interface SearchResult {
  atcCode?: string;
  name?: string;
  description?: string;
  content?: any;
  section46?: string;
  [key: string]: any;
}

export interface SearchResponse {
  results: SearchResult[];
  total?: number;
  page?: number;
  pageSize?: number;
}

class ApiService {
  private baseUrl: string;
  private token: string;
  private datasetId: string;

  constructor(baseUrl: string = 'http://localhost:3000/api', token: string = 'black_cake_348230', datasetId: string = '325a0803-600a-4de7-860f-19187a601777') {
    this.baseUrl = baseUrl;
    this.token = token;
    this.datasetId = datasetId;
  }

  async search(atcCode: string, page: number = 1, pageSize: number = 10): Promise<SearchResponse> {
    try {
      const headers: Record<string, string> = {"accept": "*/*"};
      if (this.token) {
        headers['Token'] = this.token;
      }

      // Get the specific dataset content
      const response = await fetch(`${this.baseUrl}/datasets/${this.datasetId}`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dataset = await response.json();
      
      // Debug: Log the dataset structure
      console.log('Dataset structure:', dataset);
      console.log('Dataset keys:', Object.keys(dataset));
      
      // Search within the dataset content for the ATC code
      const results = this.searchATCInDataset(dataset, atcCode);
      
      // Debug: Log search results
      console.log('Search term:', atcCode);
      console.log('Search results:', results);

      return {
        results,
        total: results.length,
        page,
        pageSize
      };
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  private searchATCInDataset(dataset: any, atcCode: string): SearchResult[] {
    const results: SearchResult[] = [];
    const searchTerm = atcCode.toLowerCase();

    console.log('Searching for:', searchTerm);
    console.log('Dataset data content type:', typeof dataset.data?.content);
    console.log('Dataset data content:', dataset.data?.content);

    // Handle the actual dataset structure: dataset.data.content is an array
    if (dataset.data && dataset.data.content && Array.isArray(dataset.data.content)) {
      console.log('Content is array with', dataset.data.content.length, 'items');
      
      dataset.data.content.forEach((item: any, index: number) => {
        console.log(`Item ${index}:`, item);
        if (this.itemContainsATC(item, searchTerm)) {
          console.log('Found match in item:', item);
          results.push({
            ...item,
            atcCode: item.code_atc,
            name: item.label_atc,
            content: item,
            section46: this.extractSection46(item)
          });
        }
      });
    }

    console.log('Final results count:', results.length);
    return results;
  }

  private extractSection46(item: any): string {
    // Extract relevant section 4.6 information from the item
    const sections = [];
    
    if (item.section_4_6_est_vide !== undefined) {
      sections.push(`Section 4.6 vide: ${item.section_4_6_est_vide}`);
    }
    
    if (item.risque_suspecte_justification) {
      sections.push(`Risque suspecté: ${item.risque_suspecte_justification}`);
    }
    
    if (item.risque_avere_justification) {
      sections.push(`Risque avéré: ${item.risque_avere_justification}`);
    }
    
    if (item.risque_non_determine_justification) {
      sections.push(`Risque non déterminé: ${item.risque_non_determine_justification}`);
    }
    
    if (item.risque_non_suggere_justification) {
      sections.push(`Risque non suggéré: ${item.risque_non_suggere_justification}`);
    }
    
    return sections.join('\n\n');
  }

  private itemContainsATC(item: any, searchTerm: string): boolean {
    const searchableFields = ['code_atc', 'label_atc', 'filename', 'risque_suspecte_justification', 'risque_avere_justification', 'risque_non_determine_justification', 'risque_non_suggere_justification'];
    
    console.log('Checking item:', item);
    
    return searchableFields.some(field => {
      const value = item[field];
      const matches = value && typeof value === 'string' && value.toLowerCase().includes(searchTerm);
      if (matches) {
        console.log(`Match found in field "${field}":`, value);
      }
      return matches;
    });
  }

  private searchObjectForATC(obj: any, searchTerm: string): SearchResult[] {
    const results: SearchResult[] = [];
    
    if (typeof obj !== 'object' || obj === null) {
      return results;
    }

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      
      if (typeof value === 'string' && value.toLowerCase().includes(searchTerm)) {
        results.push({
          atcCode: key,
          name: key,
          content: value,
          section46: value
        });
      } else if (typeof value === 'object' && value !== null) {
        // Recursively search nested objects
        const nestedResults = this.searchObjectForATC(value, searchTerm);
        results.push(...nestedResults);
      }
    });

    return results;
  }

  async getDatasetContent(): Promise<any> {
    try {
      const headers: Record<string, string> = {};
      if (this.token) {
        headers['TOKEN'] = this.token;
      }

      const response = await fetch(`${this.baseUrl}/datasets/${this.datasetId}`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get dataset content error:', error);
      throw error;
    }
  }

  async getStructuredDataset(): Promise<any> {
    try {
      const headers: Record<string, string> = {};
      if (this.token) {
        headers['TOKEN'] = this.token;
      }

      const response = await fetch(`${this.baseUrl}/datasets/structured/${this.datasetId}`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get structured dataset error:', error);
      throw error;
    }
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  setToken(token: string) {
    this.token = token;
  }

  setDatasetId(datasetId: string) {
    this.datasetId = datasetId;
  }
}

export const apiService = new ApiService();
