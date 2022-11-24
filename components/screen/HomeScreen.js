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

const HomeScreen = () => {
    // const [selected, setSelected] = React.useState(INITIAL_DATE);
    // const [currentMonth, setCurrentMonth] = React.useState(INITIAL_DATE);

    // const getDate = (count) => {
    //     const date = new Date(INITIAL_DATE);
    //     const newDate = date.setDate(date.getDate() + count);
    //     console.log(CalendarUtils.getCalendarDateString(newDate));
    //     return CalendarUtils.getCalendarDateString(newDate);
    // };

    // const onDayPress = React.useCallback((day) => {
    //     setSelected(day.dateString);
    // }, []);

    // const marked = React.useMemo(() => {
    //     console.log('marked');
    //     return {
    //         // [getDate(-1)]: {
    //         //     marked: true
    //         // },
    //         [selected]: {
    //             selected: true,
    //             disableTouchEvent: true,
    //             selectedColor: '#0099ff',
    //             selectedTextColor: 'white'
    //         }
    //     };
    // }, [selected]);

    // return (
    //     <View>
    //         <CalendarList
    //             markingType={'custom'}
    //             markedDates={marked}
    //             horizontal={true}
    //             pagingEnabled={true}
    //             monthFormat={'yyyy MM'}
    //             onVisibleMonthsChange={(months) => console.log(months)}
    //             initialDate={INITIAL_DATE}
    //             onDayPress={onDayPress}
    //             hideArrows={false}
    //             hideExtraDays={false}
    //             hideDayNames={false}
    //             enableSwipeMonths={true}
    //             current={INITIAL_DATE}
    //         />
    //         <View>
    //             <Text>plus</Text>
    //         </View>
    //     </View>
    // )
    const [popup, setPopup] = React.useState(false);
    const [serachText, setSearchText] = React.useState('');
    const [selected, setSelected] = React.useState(INITIAL_DATE);
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
                onMonthChange={(month) => { console.log(month); }}
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