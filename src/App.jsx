import React, {Component , useState } from 'react';

import './App.css';
import WeatherIcon from './components/WeatherIcon';
import WeatherDetails from './components/WeatherDetails';
import connect from '@vkontakte/vk-connect'


import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Button from '@vkontakte/vkui/dist/components/Button/Button';







async function fetchData(){
	
	let data = {
		lat: 56.4977, 
		long: 84.9744
	};

	try {
		data = await connect.sendPromise("VKWebAppGetGeodata");
	} catch (ex) {
		console.log(ex);
		console.log("Can't get locations!");	
	}

	
	
	console.log(data);
	return(data);
	}




class App extends Component {
	
	

	state = {
		icon: '',
		time: 1,
		minutes: '',
		city: '',
		temperature: '',
		humid:'',
		weatherCode: '',
		descript:'',
		windSpeed:'',
		fetching: true
	};

	
	

	

	componentDidMount() {
		this.fetchWeatherData();
	};

	fetchWeatherData = async () => {

		

		const baseUrl = `https://api.openweathermap.org`;
		const path = `/data/2.5/weather`;
		const appId = `b0a5bc64f34cf157799692698381545a`;
		const query = `units=metric&lang=ru&appid=${appId}`;

		
		const data = await fetchData();
		

		// fetchData()
		console.log('a:');
		console.log(data);
		

		

		fetch(`${baseUrl}${path}?lat=${data.lat}&lon=${data.long}&${query}`)
			.then(response => response.json())
			.then(data => {
				const date = new Date();
				const time = date.getHours();
				const city = data.name;
				
				let minutes = date.getMinutes();
				if (minutes<10) {minutes = '0'+ minutes}

				this.setState({
					time,
					minutes,
					city,
					temperature: Math.round(data.main.temp),
					humid: Math.round(data.main.humidity),
					descript: data.weather[0].description,
					weatherCode: data.weather[0].id,
					windSpeed: data.wind.speed,
					fetching: false
				});
			})
			.catch(error => console.error(error));
		
	}
	getAccess = async () => {
		let data;
		try {
			data = await connect.sendPromise("VKWebAppAllowNotifications");
		} catch {
			console.log("sorry");
		}
		document.getElementById('1').hidden = true;
	}
	
			
	

	render() {
		
		const {fetching, icon, time, minutes, city, temperature, humid, descript, windSpeed, weatherCode} = this.state;

	
		setTimeout( () => {
				document.getElementById('1').hidden = false;
		}, 3000);
		

		return fetching ?
			<div className="app"><ScreenSpinner size='large' /></div>
			
			:
			<div className="app" data-hour={time}>
				<div className="widget">
					<WeatherIcon
						icon={icon}
						weatherCode={weatherCode}
						time={time}/>
					<WeatherDetails
						city={city}
						temperature={temperature}
						humidity={humid}
						descript={descript}
						windSpeed={windSpeed}/>
				</div>
				<Button id='1' className="btn_al" onClick={this.getAccess}>Включить утренние уведомления?</Button>
				<div className="time">
					Последнее обновление {time}:{minutes}
				</div>
			</div>;
		
	}
}

export default App;

// https://api.openweathermap.org/data/2.5/weather?lat=103.234&lon=35.402&units=metric&lang=ru&appid=b0a5bc64f34cf157799692698381545a
// https://api.openweathermap.org/data/2.5/weather?lat=35.23423&lon=139.235345&appid=b0a5bc64f34cf157799692698381545a