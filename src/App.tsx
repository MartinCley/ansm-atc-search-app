import React, { useState } from 'react';
import SearchInput from './components/SearchInput';
import SearchResults from './components/SearchResults';
import { apiService, SearchResult } from './services/api';
import './App.css';

const App: React.FC = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await apiService.search(query);
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ANSM</h1>
        <p>Analyse rubrique 4.6 des RCPs</p>
      </header>
      
      <main className="App-main">
        <div className="search-section">
          <SearchInput 
            onSearch={handleSearch} 
            loading={loading}
          />
        </div>

        <div className="results-section">
          {hasSearched && (
            <SearchResults 
              results={results}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>ANSM</p>
      </footer>
    </div>
  );
};

export default App;
