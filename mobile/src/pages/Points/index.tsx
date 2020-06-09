import React, {useState , useEffect} from 'react';
import { View , Image, StyleSheet , Text,TouchableOpacity ,Alert, ScrollView} from 'react-native';
import Constants from 'expo-constants';
import {Feather as  Icon } from '@expo/vector-icons';
import {useNavigation , useRoute } from '@react-navigation/native';

import Emoji from 'react-native-emoji';
//geo localizacao
import  * as Location from 'expo-location';

//expotacao da api
import api from '../../services/api';

//mapas
import MapView, {Marker} from 'react-native-maps';
//imagens
import {SvgUri} from 'react-native-svg';

// interface dos items
interface Item{
  id: number;
  title:string;
  image_url: string
}

//items
interface Point{
  id:number,
  name:string ,
  image: string,
  image_url: string,
  latitude:number ,
  longitude:number ,
}


//routes
interface Params{
  uf:string;
  city: string;

}


const Points = () =>{
  //ESTADOS
// api dos itens
const [items , setItems] = useState<Item[]>([]);

// api dos itens
const [points , setPoints] = useState<Point[]>([]);

// selecao de items
const [selectedItems, setSelectedItems] = useState<Number[]>([]);

// localizacao do usuario
const [initialPosition , setInitialPosition] = useState<[number , number]>([0,0]);

//Navegacao parra o Home
const navigation = useNavigation();  

const route = useRoute();

const routeParams = route.params as Params;

//buscar items do usuario
useEffect (() =>{
  api.get('points',{
    params:{
      uf:  routeParams.uf,
      items: selectedItems
    }
  }).then(res =>{
    setPoints(res.data);
  })
}, [])

//acessar localizacao do usuario em tempo real
useEffect(() =>{
  async function loadPosition(){
    const { status } = await Location.requestPermissionsAsync();
    
    if(status !== 'granted'){
      Alert.alert('Ooooops' , 'Permisao para obter a localizacao');
      return;
    }
    const location = await Location.getCurrentPositionAsync();
    
    const { latitude , longitude} = location.coords;

    
      setInitialPosition([
        latitude,
        longitude
       
      ])
  }
  loadPosition()
}, []);

//LIGACAO COM A API PARA OS ITEMS
  useEffect(() =>{
    api.get('items').then(res =>{
        setItems(res.data);
    })
  }, [selectedItems])

function handleNavigateToHome(){
  navigation.goBack();
}

//Navegacao para a Detail
function handleNavigateToDetail(id: Number){
  navigation.navigate('Detail' , { point_id : id});

}

//selecao de item 
function handleSelectItem(id:Number){
  //funcao de escolha para remover uma ecolha de item
  const alreadySeected = selectedItems.findIndex(item => item === id);
 
  if(alreadySeected >= 0){ 
    const filterdItems = selectedItems.filter(item => item !== id);
    setSelectedItems(filterdItems);
  }else{
    setSelectedItems([...selectedItems, id]);
  }
}

  return (
    <>
    <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateToHome } >
          <Icon 
            name="arrow-left" 
            size={20} 
            color="#34cb79" 
          />
        </TouchableOpacity>
        <Emoji name="smiley" style={{ fontSize: 20 }} />{' '}
      <Text style={styles.title}> Bem Vindo.</Text>
      <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
      
       <View style={styles.mapContainer}>
       { initialPosition[0] !== 0 && (
          <MapView 
          style={styles.map} 
          loadingEnabled={initialPosition[0] === 0}
          initialRegion={{
              latitude: initialPosition[0],
              longitude: initialPosition[1],
              latitudeDelta: 0.15,
              longitudeDelta: 0.015,
          }}
          >
            {points.map(point =>{

            <Marker 
            key={String(point.id)}
            style={styles.mapMarker}
            onPress={() => handleNavigateToDetail(point.id)}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
              }}
            >
            <View style={styles.mapMarkerContainer}>
              <Image style={styles.mapMarkerImage} source={{uri:point.image_url}}/>
                <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                </View>
              </Marker>
            })}
          </MapView>
       )}
      </View>
    </View>
    <Text style={styles.material}>Material Reciclavel</Text>
    <View style={styles.itemsContainer}>
      <ScrollView 
      horizontal 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal: 20}}  
      >
       
        {items.map(item => (
         <TouchableOpacity 
         key={String(item.id)} 
         style={[
          styles.item,
         selectedItems.includes(item.id) ? styles.selectedItem: {}
         ]} 
         onPress={() => handleSelectItem(item.id)} 
         activeOpacity={0.6}
         >
          <SvgUri width={42} height={42} uri={item.image_url} />
           <Text style={styles.itemTitle}>{item.title}</Text>
           </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    
    </>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },
  material: {
    fontSize: 18,
    fontFamily: 'Roboto_400Regular',
    marginTop: 1,
    paddingHorizontal: 32,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;