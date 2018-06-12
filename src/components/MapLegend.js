import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-fa-icons';
import I18n from 'react-native-i18n';


/*
{
    "id": 2,
    "designation": "Atelier",
    "color": "#e6e0cb",
    "sortOrder": 2
},
*/
const getLegend = () => {
    const locTypes = require('./common/localTypes.json');
    let legend =[];
    if(locTypes && locTypes.length>0){
        legend= locTypes.reduce((accumulator, currentValue)=>{
        const {designation} = currentValue;
        if(accumulator){
            const index = accumulator.findIndex(a => a.designation ===designation);
            if(index === -1){
                accumulator.push(currentValue);
            }
        }else{
            accumulator.push(currentValue);
        }
        return accumulator;
        },[])
    }
   
    return  legend.map( l => (<View key={l.id} style={{flex:1, flexDirection:'row'}}> 
        <Icon style={{color:l.color, fontSize: 20, paddingRight:5}} name="square" />
                 <Text style={{color: '#007aff'}}>{l.designation} </Text>
             </View>
            ))
  };
const Legend = (props) =>{
    return (
        <View>
         <Text style={{color: '#007aff', fontSize:18, paddingBottom:5}}> {I18n.t('mapPage.mapLegend')} </Text>
         {getLegend()}
        </View>
    )
}


export default Legend;