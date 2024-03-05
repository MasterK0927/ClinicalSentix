export const fetchData = (drugname, setVariable, setError, setLoading) => {
  fetch(`http://localhost:3000/api/search/${drugname}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Drug not found');
      }
      return res.json();
    })
    .then((data) => {
      setVariable(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Error fetching data:', err);
      setError(true);
      setLoading(false);
    });
};



export const stringToDate = (_date, _format, _delimiter) => {
    if (!_date) return new Date();
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(
      dateItems[yearIndex],
      month,
      dateItems[dayIndex]
    );
    return formatedDate;
  }