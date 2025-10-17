// defined API URL
const API_URL = 'http://localhost:3000/api/events';

// get id from location.search
const id = new URLSearchParams(window.location.search).get('id');

// show some information if not found the event
if (!id) {
  document.getElementById('event-details').innerHTML = '<p>No event selected.</p>';
} else {
  // while call API to get event detail
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(event => {
      const container = document.getElementById('event-details');
      // build container content
      container.innerHTML = `
        <div class="event-card">
          <h2>${event.name}</h2>
          <p><strong>Status:</strong> <span class="${event.status}">${event.status}</span></p>
          <p><strong>Organisation:</strong> ${event.organisation}</p>
          <p><strong>Category:</strong> ${event.category}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p><strong>Date:</strong> ${new Date(event.start_date).toLocaleString()} - ${new Date(event.end_date).toLocaleString()}</p>
          <p><strong>Price:</strong> $${event.ticket_price}</p>
          <p><strong>Goal:</strong> $${event.goal_amount} | <strong>Raised:</strong> $${event.raised_amount}</p>
          <p><strong>Description:</strong> ${event.description}</p>
          <button class="button" onclick="alert('This feature is currently under construction.')">Register</button>
        </div>
    `;
    })
    .catch(err => {
      // show error message if there is any error
      document.getElementById('event-details').innerHTML = `<p style="color:red;">Error loading event details: ${err.message}</p>`;
    });
}

// add event listener for donate
document.getElementById('donate').addEventListener('click', function (e) {
  alert('This feature is currently under construction.');
});

// add event listener for register
document.getElementById('register').addEventListener('click', function (e) {
  alert('This feature is currently under construction.');
});
