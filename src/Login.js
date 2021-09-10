import {StyleSheet, View, TextInput, Text, Button} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const signInWithPhoneNumber = async () => {
    setLoading(!loading);
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
    setLoading(!loading);
  };

  const confirmCode = async () => {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  };

  if (!confirm) {
    return (
      <View style={styles.justifyCenter}>
        <Text>Please enter your phone number </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          defaultValue="+976"
        />
        {!loading ? (
          <Button onPress={signInWithPhoneNumber} title="Submit" />
        ) : (
          <Button
            onPress={signInWithPhoneNumber}
            title="SMS code sent"
            disabled
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.justifyCenter}>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={text => setCode(text)}
      />
      <Button title="Confirm Code" onPress={() => confirmCode()} />
    </View>
  );
};

const styles = StyleSheet.create({
  justifyCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 20,
    width: 209,
    marginVertical: 10,
  },
});

export default Login;
