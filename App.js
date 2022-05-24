import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Image, ActivityIndicator, FlatList } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [ville, setVille] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [description, setDescription] = useState(null);
  const [icone, setIcone] = useState(null);
  const [prevision, setPrevision] = useState(null);

  let key = '54b2306084d05aace9fbc9b7a49254fc';

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission non accordée');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const MeteoDaily = () =>{
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&exclude=hourly,minutely,alerts&appid=${key}&units=metric&lang=fr`)
          .then(function(response){
              return response.json();
          }).then(function(response){
            setPrevision(response.daily)
      })
  }

  const MeteoVille = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${key}&units=metric&lang=fr`)
        .then(function(response){
          return response.json();
        }).then(function(response){
          setVille(response.name);
          setTemperature(response.main.temp)
          setDescription(response.weather[0].description)
          setIcone(response.weather[0].icon)
    })
  }

  useEffect( () => {
    location && MeteoVille()
     location && MeteoDaily()
  })
        return (
      <View style={styles.container}>
        {location == null ?<ActivityIndicator size="large"/> : null}
        <Image style={styles.image} source={{
          uri: `http://openweathermap.org/img/w/${icone}.png`
        }}></Image>
        <View style={styles.text}>
        <Text>Vous êtes actuellement dans la ville de</Text><Text style={styles.styleville} > {ville}</Text>
        <Text>La température extérieure est de {temperature}°C</Text>
        <Text>{description}</Text>
            <FlatList
                data = {prevision}
                renderItem={({item}) =>
                <Text>{item.temp.max}</Text>}
                />
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "lightcyan",
  },
  styleville: {
    fontWeight:"bold",
  },
  image:{
      width: 75,
      height: 75,
  },
  text:{
    alignItems:"center",
  }
});
