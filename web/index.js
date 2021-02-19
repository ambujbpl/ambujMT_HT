// Ambuj Dubey
$( document ).ready(function() {
  fetch('/getData')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      response.json().then(function({data}) {
        $('.tableArea').html(`<table>`);
        let thead = '<tr>';
        let tbody = '<tr>';
        for(key in data) {
          thead += `<th>${key}</th>`;
          tbody += `<td>${data[key]}</td>`;
        }
        thead += `</tr>`
        tbody += `</tr>`
        $('.tableArea').append(thead);
        $('.tableArea').append(tbody);
        $('.tableArea').append(`</table>`);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
});