import Data from './data.json';
import './Card.css';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface Job {
  id: number;
  company: string;
  logo: string;
  new: boolean;
  featured: boolean;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  location: string;
  languages: string[];
  tools: string[];
}

const Card = () => {
  const [filters, setFilters] = useState<string[]>([]);
  const [results, setResults] = useState<Job[]>([...Data]);
  const [originalData, setOriginalData] = useState<Job[]>([...Data]);

  function filterResults(card: Job, filters: string[]): boolean {
    return filters.every((filter) => {
      const filterLower = filter.toLowerCase();

      // Check if the card matches the filter on the role, level, or location keys
      if (
        card.role.toLowerCase().includes(filterLower) ||
        card.level.toLowerCase().includes(filterLower) ||
        card.location.toLowerCase().includes(filterLower)
      ) {
        return true;
      }

      // Check if the card matches any of the filters on the language or tools keys
      if (
        card.languages.some((language) =>
          language.toLowerCase().includes(filterLower)
        ) ||
        card.tools.some((tool) => tool.toLowerCase().includes(filterLower))
      ) {
        return true;
      }

      // The filter did not match any of the keys on the card
      return false;
    });
  }

  useEffect(() => {
    if (filters.length < 1) {
      setResults(originalData);
      return;
    }
    const query = originalData.filter((card) => filterResults(card, filters));

    setResults(query);
  }, [filters]);

  return (
    <>
      {filters.length > 0 && (
        <div className="queries__container">
          <div className="queries">
            {filters.map((filter) => (
              <div className="little__container">
                <span className="filters">{filter}</span>
                <button
                  className="delete__filter"
                  onClick={(e) => {
                    setFilters(filters.filter((x) => x !== filter));
                  }}
                >
                  <IoClose />
                </button>
              </div>
            ))}
          </div>
          <button
            className="clear"
            onClick={() => {
              setResults(originalData);
              setFilters([]);
            }}
          >
            Clear
          </button>
        </div>
      )}
      <div className="card__container">
        {results.map((job) => (
          <div
            key={job.id}
            className={'card' + (job.featured ? ' featured' : '')}
          >
            <div className="card__left">
              <img className="logo" src={job.logo} alt="logo" />
              <div className="card__left__text">
                <div className="card__top">
                  <h2 className="card__company">{job.company}</h2>
                  {job.new || job.featured ? (
                    <div className="card__badge">
                      {job.new && <span className="new__badge">New!</span>}
                      {job.featured && (
                        <span className="featured__badge">Featured</span>
                      )}
                    </div>
                  ) : null}
                </div>
                <h2 className="card__title">{job.position}</h2>
                <div>
                  <ul className="card__tags">
                    <li>{job.postedAt}</li>
                    <li>{job.contract}</li>
                    <li>{job.location}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card__right">
              <button onClick={() => setFilters([...filters, job.role])}>
                {job.role}
              </button>
              <button onClick={() => setFilters([...filters, job.level])}>
                {job.level}
              </button>
              {job.tools.map((tool) => (
                <button
                  key={tool}
                  onClick={() => setFilters([...filters, tool])}
                >
                  {tool}
                </button>
              ))}
              {job.languages.map((language) => (
                <button
                  key={language}
                  onClick={() => setFilters([...filters, language])}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Card;
