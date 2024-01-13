$(document).ready(init);

const HOST = '0.0.0.0';
const amenityObj = {};
const locationObj = {};

function init() {
  $('.amenities .popover input').change(function () {
    const amenityName = $(this).attr('data-name');
    const amenityId = $(this).attr('data-id');

    if ($(this).is(':checked')) {
      amenityObj[amenityName] = amenityId;
    } else {
      delete amenityObj[amenityName];
    }

    updateFilterDisplay();
  });

  $('.locations .popover input').change(function () {
    const locationId = $(this).attr('data-id');
    const locationName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      locationObj[locationName] = locationId;
    } else {
      delete locationObj[locationName];
    }

    updateFilterDisplay();
  });

  $('button').click(function () {
    searchPlaces();
  });

  apiStatus();
  searchPlacesAmenities();
}

function updateFilterDisplay() {
  const amenityNames = Object.keys(amenityObj).sort().join(', ');
  const locationNames = Object.keys(locationObj).sort().join(', ');

  $('.amenities h4').text(amenityNames);
  $('.locations h4').text(locationNames);
}

function searchPlaces() {
  const placesUrl = `http://${HOST}:5001/api/v1/places_search/`;
  const requestData = {
    amenities: Object.values(amenityObj),
    cities: Object.values(locationObj)
  };

  $.ajax({
    url: placesUrl,
    type: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(requestData),
    success: function (response) {
      $('SECTION.places').empty();
      for (const place of response) {
        const article = [
          '<article>',
          '<div class="title_box">',
          `<h2>${place.name}</h2>`,
          `<div class="price_by_night">$${place.price_by_night}</div>`,
          '</div>',
          '<div class="information">',
          `<div class="max_guest">${place.max_guest} Guest(s)</div>`,
          `<div class="number_rooms">${place.number_rooms} Bedroom(s)</div>`,
          `<div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>`,
          '</div>',
          '<div class="description">',
          `${place.description}`,
          '</div>',
          '</article>'
        ];
        $('SECTION.places').append(article.join(''));
      }
    },
    error: function (error) {
      console.error(error);
    }
  });
}
