import { DateTime } from 'luxon';
const API_KEY = '6047b37bc7910a88671026613ca26112';
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeatherData = (infoType, searchParams) => {
    const url = new URL(BASE_URL + "/" + infoType);
    url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });
    
    console.log(url);
    return fetch(url).then((res) => res.json()).then((data) => data);
    
};

const formatCurrentWeather = (data) => {
    const {
        coord: {lat, lon},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys: {country, sunrise, sunset},
        weather,
        wind: {speed}

    } = data

    const{main: details, icon} = weather[0]

    return {lat, lon, temp, feels_like, temp_min, temp_max, humidity, name, dt, country, sunrise, sunset, weather, speed};

};

const formatForecastWeather = (data) => {
    let { timezone, daily, hourly } = data;
    daily = daily.slice(1, 6).map(d => {
        return {
            title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
            temp: d.temp.day,
            icon: d.weather[0].icon
        };
    });

    hourly = hourly.slice(1, 6).map(h => {
        return {
            title: formatToLocalTime(h.dt, timezone, 'hh:mm a'),
            temp: h.temp,
            icon: h.weather[0].icon
        };
    });

    return { timezone, daily, hourly };
};


const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData
    ('weather', searchParams).then(formatCurrentWeather);

    const {lat, lon} = formattedCurrentWeather;
    
    const formattedForecastWeather = await getWeatherData("weather", 
    {lat: 44.34,
     lon: 10.99,
    }).then(formatForecastWeather);

    return { ...formattedCurrentWeather, ...formattedForecastWeather};
}

const formatToLocalTime = (secs, zone, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);


const iconUrlFromCode = (code) => 'http://openweathermap.org/img/wn/${code}@2x.png';

export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode };
