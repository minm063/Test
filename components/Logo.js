import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const width = Dimensions.get('window').width;
const Logo = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#00aeff' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Entypo name="creative-cloud" size={width / 100 * 50} color={'#fff'} />
                <Text style={{ fontSize: 30, color: '#fff' }}>운동 캘린더</Text>
            </View>
        </View>
    )
}
export default Logo;