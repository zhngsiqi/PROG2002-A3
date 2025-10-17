// defined API URL
const API_URL = 'http://localhost:3000/api/events/search';

// add event listener for search button
document.getElementById('search-form').addEventListener('submit', function (e) {
  // prevent default event
  e.preventDefault();

  // get search input value
  const date = document.getElementById('search-date').value;
  const location = document.getElementById('search-location').value;
  const category = document.getElementById('search-category').value;

  // The final URL needs to be concatenated.
  // If the search input box is filled in, the corresponding parameters should be concatenated in the URL
  let url = `${API_URL}?`;
  if (date) {
    url += `date=${date}&`
  }
  if (location) {
    url += `location=${location}&`
  }
  if (category) {
    url += `category=${category}`
  }

  // call API
  fetch(url)
    .then(res => res.json())
    .then(events => {
      const container = document.getElementById('search-results');
      // clear container content
      container.innerHTML = '';

      // show some information if there is no events
      if (events.length === 0) {
        container.innerHTML = '<p>No matching events found.</p>';
        return;
      }

      // for loop all events and build event card
      events.forEach(event => {
        const card = document.createElement('div');
        // set class
        card.className = 'event-card';
        // set event card content
        card.innerHTML = `
           <img src="/images/28694602_charity_set_1.jpg" />
          <h3>${event.name}</h3>
          <p><strong>Category:</strong> ${event.category}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p><strong>Date:</strong> ${new Date(event.start_date).toLocaleDateString()}</p>
          <p><strong>Price:</strong> $${event.ticket_price}</p>
          <p><strong>Status:</strong> <span class="${event.status}">${event.status}</span></p>
          <a class="view-details-button" href="event.html?id=${event.event_id}">View Details</a>
        `;
        // append card to container
        container.appendChild(card);
      });
    })
    .catch(err => {
      // show error message if there is any error
      document.getElementById('search-results').innerHTML = `<p style="color:red;">Error loading search results: ${err.message}</p>`;
    });
});

// clear filter condition
document.getElementById('clear-filters').addEventListener('click', () => {
  // reset search form input
  document.getElementById('search-date').value = '';
  document.getElementById('search-location').value = '';
  document.getElementById('search-category').value = '';
  document.getElementById('search-results').innerHTML = '';
});

// add event listener for donate
document.getElementById('donate').addEventListener('click', function (e) {
  alert('This feature is currently under construction.');
});

// add event listener for register
document.getElementById('register').addEventListener('click', function (e) {
  alert('This feature is currently under construction.');
});
