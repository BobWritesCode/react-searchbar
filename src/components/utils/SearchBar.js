import React, { useEffect, useRef, useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import MySpinner from './Spinner';
import { MockSearch } from '../../functions/MockSearch';

const SearchBar = () => {
  // Use to control text-input
  const [content, setContent] = useState('');
  // Use to store search results
  const [results, setResults] = useState([]);
  // Use to control if user clicks outside search results, to close results.
  const searchContainerRef = useRef(null);
  // Use to show spinner while API is resolving.
  const [showSpinner, setShowSpinner] = useState(false);

  /**
   * Allow user to edit input.
   * @param {*} e
   */
  const handleChange = (e) => {
    setContent(e.target.value);
    if (!e.target.value) {
      setResults({});
    }
  };

  /**
   * Handles user clicking on one of the search results.
   * Takes user to the profile page, and clears content, and results.
   * @param {number} id
   */
  const handleSearchResultClick = (id) => {
    // Button action here.
    setContent('');
    setResults({});
    setShowSpinner(false);
  };

  /**
   * Checks to see if user is clicking outside the search results, if so close results.
   */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the user click an element outside the search container
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setResults({});
      }
    };
    document.addEventListener('mouseup', handleOutsideClick);
    return () => {
      document.removeEventListener('mouseup', handleOutsideClick);
    };
  }, []);

  /**
   * Fetches search results from the API
   */
  useEffect(() => {
    if (content) {
      setShowSpinner(true);
      const fetchData = async () => {
        try {
          // Mock API request.
          console.log(content);
          const data = MockSearch({ query: content });
          setResults(data);
        } catch (err) {
          /* empty */
        } finally {
          setShowSpinner(false);
        }
      };

      // A 1 second timer, to allow user to stop typing before calling API.
      const timer = setTimeout(() => {
        fetchData();
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [content]);

  /**
   * JSX element to list search results as clickable buttons, that will take the user
   * to the selected user's profile page.
   */
  const ShowResults = (
    <>
      {results.length &&
        results.map((result, index) => (
          <div key={index}>
            <Button
              variant="light"
              className="w-100 rounded-0"
              onClick={() => handleSearchResultClick(result)}
            >
              {result}
            </Button>
          </div>
        ))}
    </>
  );

  /**
   * JSX element to show spinner until user stops typing and API resolves.
   */
  const ShowSpinner = (
    <>
      <div className="position-relative">
        <div
          className="border border-secondary  border-top-0 position-absolute"
          style={{ width: '100%' }}
        >
          <div className="w-100 rounded-0 bg-light text-dark py-2">
            <MySpinner variant="dark" />
          </div>
        </div>
      </div>
    </>
  );

  /**
   * JSX element to act as a container for the search results.
   */
  const ShowResultsContainer = (
    <>
      <div className="position-relative">
        <div
          className="border border-secondary  border-top-0 position-absolute"
          style={{ width: '100%' }}
        >
          {!showSpinner && ShowResults}
        </div>
      </div>
    </>
  );

  /**
   * JSX element to display the search bar.
   */
  const ShowSearchBar = (
    <>
      <InputGroup className="ms-0">
        <InputGroup.Text className="bg-light border-right-0 rounded-0 border-secondary">
          <i className="bi bi-search text-dark"></i>
        </InputGroup.Text>
        <Form.Control
          placeholder="User search"
          aria-label="User searchbar"
          className="rounded-0 border-secondary"
          onChange={handleChange}
          value={content}
        />
      </InputGroup>
    </>
  );

  /**
   * Main return render.
   */
  return (
    <div ref={searchContainerRef}>
      {ShowSearchBar}
      {results.length > 0 && ShowResultsContainer}
      {showSpinner && ShowSpinner}
    </div>
  );
};

export default SearchBar;
