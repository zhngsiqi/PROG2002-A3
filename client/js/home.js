// defined API URL
const API_URL = 'http://localhost:3000/api/events';

// call API
fetch(API_URL)
  .then(res => res.json())
  .then(events => {
    const container = document.getElementById('events-list');
    // clear container content
    container.innerHTML = '';

    // show some information if there is no events
    if (events.length === 0) {
      container.innerHTML = '<p>No events available.</p>';
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
    document.getElementById('events-list').innerHTML = `<p style="color:red;">Error loading events: ${err.message}</p>`;
  });


// add event listener for donate
document.getElementById('donate').addEventListener('click', function (e) {
  alert('This feature is currently under construction.');
});

// add event listener for register
document.getElementById('register').addEventListener('click', function (e) {
  alert('This feature is currently under construction.');
});
