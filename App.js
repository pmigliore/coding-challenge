/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const APIKEY = '930279b0';

const App: () => Node = () => {
  const [isLoading, setLoading] = useState(true);
  const [total, setTotal] = useState(1000);
  const [count, setCount] = useState(3);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(334);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const getMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://my.api.mockaroo.com/users.json?page=${page}&count=${count}&key=${APIKEY}`,
      );
      const json = await response.json();
      setData(json.entries);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const increasePage = () => {
    if (page < lastPage) {
      setPage(page + 1);
      getMovies();
    }
  };

  const decreasePage = () => {
    if (page > 1) {
      setPage(page - 1);
      getMovies();
    }
  };

  const increaseCount = () => {
    if (count < 50) {
      setCount(count + 1);
      setLastPage(total / count);
    }
  };

  const decreaseCount = () => {
    if (count > 3) {
      setCount(count - 1);
      setLastPage(total / count);
    }
  };

  const resetFilters = () => {
    setCount(3);
    setPage(1);
    getMovies();
    setModalVisible(false);
  };

  const saveChanges = () => {
    getMovies();
    setModalVisible(false);
  };

  useEffect(() => {
    getMovies();
  }, []);

  const PageHandler = () => (
    <View style={styles.pagesView}>
      <TouchableOpacity onPress={decreasePage}>
        <Icon name="chevron-back-outline" size={22} />
      </TouchableOpacity>
      <Text style={[styles.font, {fontSize: 20}]}>{page}</Text>
      <TouchableOpacity onPress={increasePage}>
        <Icon name="chevron-forward-outline" size={22} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close-outline" size={28} />
            </TouchableOpacity>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.font}>Reset</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalFilter}>
            <Text style={[styles.font, {fontSize: 17}]}>Number of results</Text>
            <View style={styles.btnFiltersView}>
              <TouchableOpacity onPress={decreaseCount}>
                <Icon name="remove-outline" size={18} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text>{count}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={increaseCount}>
                <Icon name="add-outline" size={18} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.saveBtnView}>
            <TouchableOpacity onPress={saveChanges} style={styles.saveBtn}>
              <Text style={styles.saveBtnTxt}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <Text style={styles.title}>Coding Challenge</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.font}>Filters</Text>
        </TouchableOpacity>
      </View>
      <PageHandler />
      <View style={styles.listView}>
        {isLoading ? (
          <ActivityIndicator color="black" style={{marginTop: 50}} />
        ) : (
          <FlatList
            data={data}
            renderItem={obj => {
              const name =
                obj.item.name.firstName + ' ' + obj.item.name.lastName;
              const email = obj.item.email;
              const gender = obj.item.gender;
              const role = obj.item.role;
              return (
                <View style={styles.item}>
                  <Text style={styles.title}>{name}</Text>
                  <Text style={styles.text}>{email}</Text>
                  <Text style={styles.text}>{gender}</Text>
                  <Text style={styles.text}>{role}</Text>
                </View>
              );
            }}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 0.06,
    borderBottomWidth: 1,
    borderColor: '#CACACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  listView: {
    flex: 0.9,
  },
  item: {
    borderRadius: 12,
    backgroundColor: 'white',
    borderColor: '#CACACA',
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 19,
    color: 'black',
  },
  text: {
    fontSize: 15,
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'white',
    shadowOpacity: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  btnFiltersView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: 120,
  },
  saveBtnView: {
    width: '100%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#CACACA',
    bottom: 0,
    position: 'absolute',
  },
  saveBtn: {
    backgroundColor: 'black',
    width: '80%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnTxt: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  pagesView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    flex: 0.04,
  },
  font: {
    fontWeight: 'bold',
  },
});

export default App;
