import React from "react";
import { View, Text, Pressable, Modal, ScrollView, TextInput } from 'react-native';
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Dimensions } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const RANGE = 24;
const INITIAL_DATE = new Date().toLocaleDateString('pt-br').split('/').reverse().join('-');
const widthSize = Dimensions.get('window').width;
const heightSize = Dimensions.get('window').height;

const HomeScreen = ({navigation}) => {

    const [popup, setPopup] = React.useState(false);
    const [serachText, setSearchText] = React.useState('');
    const [selected, setSelected] = React.useState(INITIAL_DATE);
    const [monthChanged, setMonthChanged] = React.useState('');
    const marked = React.useMemo(() => {
        return {
            // marked -> dot
            // [nextWeekDate]: {
            //     selected: selected === nextWeekDate,
            //     selectedTextColor: '#5E60CE',
            //     marked: true
            // },
            // [nextMonthDate]: {
            //     selected: selected === nextMonthDate,
            //     selectedTextColor: '#5E60CE',
            //     marked: true
            // },
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: '#00aeff',
                selectedTextColor: 'white'
            }
        };
    }, [selected]);

    const onDayPress = React.useCallback((day) => {
        setSelected(day.dateString);
    }, []);

    React.useEffect(() => {
        console.log('navigation');
        navigation.setOptions({
            headerTitle: () => (
                <Text>{monthChanged}</Text>
            ),
        });
    }, [navigation, monthChanged]);

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <Modal
                visible={popup}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setPopup(false)}
                onShow={() => console.log('modal shown')}
            >
                {/* 운동기록 등록 */}
                <View style={{ margin: 18 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ borderWidth: 1, width: '90%', borderRadius: 10 }}>
                            <TextInput style={{ padding: 10 }} onChangeText={text => setSearchText(text)}/>
                        </View>
                        <Pressable
                            style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}
                            onPress={() => console.log(serachText)}
                        >
                            <AntDesign name="search1" color={'#000'} size={heightSize / 36} />
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <CalendarList
                testID="calenderList"
                current={INITIAL_DATE}
                pastScrollRange={RANGE}
                futureScrollRange={RANGE}
                onDayPress={onDayPress}
                markedDates={marked}
                horizontal={true}
                pagingEnabled={true}
                monthFormat={'yyyy.MM'}
                hideArrows={false}
                hideExtraDays={false}
                disableAllTouchEventsForDisabledDays={true}
                onMonthChange={(month) => { 
                    console.log(month.dateString.slice(0,7));
                    setMonthChanged(month.dateString.slice(0,7));
                }}
            />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="bed-empty" size={30} color={'#000'} />
                <Text>운동기록이 없습니다</Text>
                <Text>우측 하단 + 버튼을 눌러 추가해보세요</Text>
            </View>
            {/* <View>
                <ScrollView>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                </ScrollView>
            </View> */}
            <View>
                <View style={{ margin: 20, position: 'absolute', bottom: 0, right: 0 }}>
                    <Pressable
                        onPress={() => {
                            setPopup(true);
                        }}>
                        <AntDesign name="pluscircle" size={widthSize / 8} color={"#00aeff"} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
export default HomeScreen;