import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Image } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [ville, setVille] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [description, setDescription] = useState(null);
  const [icone, setIcone] = useState(null);

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

  const MeteoVille = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${key}&units=metric&lang=fr`)
        .then(function(response){
          return response.json();
        }).then(function(response){
          setVille(response.name);
          setTemperature(response.main.temp)
          setDescription(response.weather[0].description)
          //setIcone(response.weather[0].icon + ".png")
    })
  }
  let text = 'Application en cours, veuillez patienter';

  useEffect( () => {
    location && MeteoVille();
  })

  return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{ville}</Text>
        <Text style={styles.paragraph}>{temperature}</Text>
        <Text style={styles.paragraph}>{description}</Text>

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
