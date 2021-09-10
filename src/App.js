import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Login from './Login';
// import TextInput from './TextInput';

const App = () => {
  const [text, setText] = useState('');
  const [user, setUser] = useState();
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      setUser(userState);
    });

    return subscriber;
  }, []);

  const signOut = () => {
    console.log('signout');
    auth().signOut();
  };

  const sendMessage = async () => {
    await firestore().collection('messages').add({
      text,
      user: user.phoneNumber,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    setText('');
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('messages')
      .orderBy('createdAt')
      .onSnapshot(querySnapshot => {
        const _messages = [];
        querySnapshot.forEach(documentSnapshot => {
          _messages.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setMessages(_messages.reverse());
        setLoading(false);
      });
    // Unsubscribe from events when no longer in use

    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={[styles.container]}>
      {user ? (
        <>
          <View>
            <View
              style={[
                styles.flexRow,
                styles.justifyCenter,
                styles.borderBottom,
              ]}>
              <Text>Welcome {user.phoneNumber} </Text>
              <Button title="Sign Out" onPress={signOut} />
            </View>
          </View>
          <View style={styles.container}>
            <FlatList
              inverted
              data={messages}
              initialNumToRender={10}
              renderItem={({item}) => (
                <View
                  style={[
                    styles.messageItem,
                    item.user === user.phoneNumber
                      ? styles.userMessage
                      : styles.otherMessage,
                  ]}>
                  <Text style={styles.white}>{item.user}</Text>
                  <Text style={styles.white}>{item.text}</Text>
                </View>
              )}
            />
          </View>
          <View style={[styles.flexRow, styles.justifyCenter]}>
            <TextInput
              style={styles.textInput}
              value={text}
              multiline
              onChangeText={messageText => setText(messageText)}
              editable
              maxLength={100}
              clearTextOnFocus={true}
              onSubmitEditing={sendMessage}
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        </>
      ) : (
        <Login />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  justifyCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageItem: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 3,
    marginHorizontal: 5,
  },
  userMessage: {
    alignItems: 'flex-end',
    backgroundColor: '#0084ff',
    marginLeft: 100,
  },
  otherMessage: {
    justifyContent: 'flex-start',
    backgroundColor: '#abb1b8',
    marginRight: 100,
  },
  flexAround: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 20,
    width: 209,
    marginVertical: 10,
  },
  textInput: {
    // height: 60,
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
    width: '80%',
    backgroundColor: 'white',
    margin: 10,
  },
  borderBottom: {
    borderBottomWidth: 1,
    padding: 10,
    backgroundColor: '#9dcbf5',
  },
  white: {
    color: 'white',
  },
});
export default App;
