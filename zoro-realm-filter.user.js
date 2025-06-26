
// ==UserScript==
// @name         Zoro's Realm Answer Filter
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds filter buttons at result page
// @author       LaxyDevUserX
// @match        https://realm-of-zoro.pages.dev/pages/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // A flag to prevent the script from running more than once
    let filtersInitialized = false;
    function createFilterControls(parentContainer) {
        if (filtersInitialized) return; // Don't run twice
        filtersInitialized = true;

        const filterContainer = document.createElement('div');
        filterContainer.id = 'answer-filter-controls';
        Object.assign(filterContainer.style, {
            textAlign: 'center',
            marginTop: '20px',
            paddingTop: '15px',
            borderTop: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
        });

        // Define the buttons with their active colors
        const buttons = [
            { text: 'All', filter: 'all', color: '#5a6268', activeTextColor: 'white' },
            { text: 'Correct', filter: 'correct-answer', color: '#4A8559', activeTextColor: 'white' },
            { text: 'Incorrect', filter: 'wrong-answer', color: '#aa4a4a', activeTextColor: 'white' },
            { text: 'Not Attempted', filter: 'not-attempted', color: '#d39e00', activeTextColor: '#212529'}
        ];

        // Creates button
        buttons.forEach((buttonInfo, index) => {
            const button = document.createElement('button');
            button.textContent = buttonInfo.text;
            button.dataset.filter = buttonInfo.filter;
            button.dataset.activeColor = buttonInfo.color;
            button.dataset.activeTextColor = buttonInfo.activeTextColor;
            button.classList.add('filter-btn');


            Object.assign(button.style, {
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                backgroundColor: '#e8e8e8',
                color: '#333',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
            });

            // Set the 'All' button as active by default
            if (index === 0) {
                setActive(button);
            }

            filterContainer.appendChild(button);
        });

        parentContainer.appendChild(filterContainer);
        filterContainer.addEventListener('click', handleFilterClick);
        console.log("Zoro Filter Script: Successfully added new flat-style filter controls.");
    }



    function setActive(button) {
        button.classList.add('active');
        button.style.backgroundColor = button.dataset.activeColor;
        button.style.color = button.dataset.activeTextColor;
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        button.style.borderColor = 'transparent';
    }



    function setInactive(button) {
        button.classList.remove('active');
        button.style.backgroundColor = '#e8e8e8';
        button.style.color = '#333';
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
        button.style.borderColor = '#ddd';
    }


    function handleFilterClick(event) {
        const clickedButton = event.target.closest('.filter-btn');
        if (clickedButton) {
            document.querySelectorAll('.filter-btn').forEach(setInactive);
            setActive(clickedButton);
            filterQuestions(clickedButton.dataset.filter);
        }
    }


    function filterQuestions(filter) {
        const allQuestions = document.querySelectorAll('.result-item');
        if (allQuestions.length === 0) {
             console.log("Zoro Filter Script: No question items found to filter.");
             return;
        }

        allQuestions.forEach(question => {
            if (filter === 'all') {
                question.style.display = 'block';
            } else {
                const hasFilterClass = question.querySelector(`p.${filter}`);
                question.style.display = hasFilterClass ? 'block' : 'none';
            }
        });
    }

    console.log("Zoro Filter Script: Running and waiting for score summary container...");
    const initCheckInterval = setInterval(() => {
        const scoreSummaryContainer = document.querySelector('.score-summary');
        if (scoreSummaryContainer) {
            clearInterval(initCheckInterval);
            createFilterControls(scoreSummaryContainer);
        }
    }, 500); // Check every 500 milliseconds

})();
