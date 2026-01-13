import React from 'react';
import { SearchResult } from '../services/api';

interface SearchResultsProps {
  results: SearchResult[];
  loading?: boolean;
  error?: string | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  loading = false, 
  error = null 
}) => {
  if (loading) {
    return (
      <div className="search-loading">
        <div className="loading-spinner"></div>
        <p>Searching database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-error">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="no-results">
        <p>No results found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <h2>Résultats ({results.length})</h2>
      <div className="results-list">
        {results.map((result, index) => (
          <div key={result.atcCode || index} className="result-item">
            <h3 className="result-title">
              {result.atcCode && `${result.atcCode} - `}
              {result.name}
            </h3>
            {result.description && (
              <div className="result-description">
                <p>{result.description}</p>
              </div>
            )}
            {result.section46 && (
              <div className="result-section46">
                <h4>Section 4.6</h4>
                <div 
                  className="result-content"
                  dangerouslySetInnerHTML={{ 
                    __html: typeof result.section46 === 'string' ? result.section46 : JSON.stringify(result.section46, null, 2) 
                  }}
                />
              </div>
            )}
            {result.content && !result.section46 && (
              <div 
                className="result-content"
                dangerouslySetInnerHTML={{ 
                  __html: typeof result.content === 'string' ? result.content : JSON.stringify(result.content, null, 2) 
                }}
              />
            )}
            {result.atcCode && (
              <div className="result-metadata">
                <strong>Code ATC:</strong> {result.atcCode}
              </div>
            )}
            {Object.keys(result).map((key) => {
              if (key !== 'atcCode' && key !== 'name' && key !== 'description' && key !== 'content' && key !== 'section46') {
                return (
                  <div key={key} className="result-metadata">
                    <strong>{key}:</strong> {String(result[key])}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
