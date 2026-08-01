# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Multi-modal journey search across bus, train and air, with a shared results page
  offering filters for operator, class, departure window, fare ceiling and rating,
  plus sorting and pagination.
- Seat selection with per-mode maps: bus decks, multi-coach train rakes and aircraft
  cabins, each drawn from a layout definition rather than stored per seat.
- Checkout through to a mock confirmation: traveller details, contact details, a ten
  minute seat hold, a simulated card or mobile-wallet payment, and a printable ticket.
- Booking lookup by reference and email, with the same ticket view.
- Boarding-pass ticket component with a masked perforation, per-mode route line and a
  bar field derived from the booking reference.
- Bangladesh seed dataset: 65 places, 122 stops, 65 operators, 342 routes and roughly
  239,000 departures over a 60 day window, generated deterministically from a seeded
  PRNG so a rebuild reproduces the same data.
- Region layer so a second market can be added with one catalog folder and one registry
  entry, without schema or interface changes.
- Light and dark themes stamped before first paint, with a manual toggle that persists.
- End-to-end coverage of the booking flow, the 404 page and booking-lookup access control.

### Notes

- Fares, seat occupancy and ratings are generated. No real tickets are sold and no
  payment details are stored.
- The bar field printed on a ticket is decorative; the reference beneath it is the
  value that identifies a booking.
