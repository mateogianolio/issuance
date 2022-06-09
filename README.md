# [issuance](https://mateogianolio.github.io/issuance)

> Open, free blogging on **Github pages** with **Github issues.**

### Quick setup

1. Fork this repository.
2. Open `index.html` and change `owner` and `repo` fields https://github.com/mateogianolio/issuance/blob/6868a93cd8f5e148662b11dfbad991f82c898cdc/index.html#L42-L43 and the issue login filter https://github.com/mateogianolio/issuance/blob/6868a93cd8f5e148662b11dfbad991f82c898cdc/index.html#L61 to match your username/repo.
3. Enable Github Pages in your repo settings if not already enabled.

Link to individual posts by appending `?<issue_number>` to `index.html`.

### Rate limiting

The Github API enforces a rate limit of 60 requests per hour per IP address (see [#17](https://github.com/mateogianolio/issuance/issues/17)).

### Live examples

* **https://casualjavascript.com**

### Styling

* `css/structure.css` regulates the structure of the website,
* `css/typography.css` regulates the typography.
