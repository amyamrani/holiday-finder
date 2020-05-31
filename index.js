'use strict';

const apiKey = 'a152ea1f468741a7690a3cf410fb22038195ef25';
const baseURL = 'https://calendarific.com/api/v2/holidays';

function formatQueryParams (params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');  
}

function displayResults(responseJson) {
    const searchCountry = $('#js-search-country').val();
    const searchCountryName = $('#js-search-country option:selected').text();
    $('#results-list').append(
        `
        <div class="result-country">
            <img src="https://www.countryflags.io/${searchCountry}/flat/64.png" alt='country flag'>
            <div><h3>${searchCountryName}</h3></div>
        </div>
        `
    )

    if (responseJson.response.holidays.length == 0) {
        $('#results-list').text('No results found.');
    }

    for (let i = 0; i < responseJson.response.holidays.length; i++) {
        $('#results-list').append(
            `<div class="result-item">
                <h3>${responseJson.response.holidays[i].name}</h3>
                <p>Date: ${responseJson.response.holidays[i].date.iso}
                <p>Description: ${responseJson.response.holidays[i].description}
                <p>Type: ${responseJson.response.holidays[i].type}
            </div>`
        )
    }
    $('#js-loading-message').empty();
    $('#results').removeClass('hidden'); 
}       

function getHolidays(searchMonth, searchDay, searchYear, searchCountry) {
    const params = {
        country: searchCountry,
        year: searchYear,
        month: searchMonth,
        day:searchDay
    }
    const queryString = formatQueryParams(params)
    const url = baseURL + '?' + queryString + '&api_key=' + apiKey;

    $('#results-list').empty();
    $('#js-error-message').empty();
    $('#js-loading-message').text('Loading...');

    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statustext);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
        $('#js-loading-message').empty();
        $('#js-error-message').text(`Sorry, something went wrong. Please try again.`);
    });
}

function watchForm() {
    $('.js-form').submit(event => {
        event.preventDefault();
        const searchMonth = $('#js-search-month').val();
        const searchDay = $('#js-search-day').val();
        const searchYear = $('#js-search-year').val();
        const searchCountry = $('#js-search-country').val();
        getHolidays(searchMonth, searchDay, searchYear, searchCountry);
    });
}
  
$(watchForm);

function setupForm() {
    for (let i = 2020; i <= 2049; i++) {
        $('#js-search-year').append(
            `<option value=${i}>${i}</option>`
        )
    }
}

$(setupForm);