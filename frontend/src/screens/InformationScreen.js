import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext';

const colors = {
  primary: '#6F1D1B',
  secondary: '#E7B18D',
  background: '#F6DFB7',
  textDark: '#432C18',
  textLight: '#E7D1B1',
  white: '#FFFFFF',
  black: '#000000',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 100,
  },
  ellipsesContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
  },
  ellipse: {
    position: 'absolute',
    width: 100,
    height: 90,
    resizeMode: 'contain',
  },
  secondEllipsePosition: {
    top: 0,
    right: -10,
    width: 120,
    height: 120,
    resizeMode: 'contain',
    opacity: 0.8,
  },
  avatarTouchable: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    zIndex: 1,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    resizeMode: 'cover',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: 100,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    width: '85%',
    marginVertical: 25,
    paddingHorizontal: 10,
    shadowColor: colors.textDark,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  filterIcon: {
    marginHorizontal: 10,
  },
  selectedFilter: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 80,
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginVertical: 10,
    padding: 20,
  },
  pageNumber: {
    fontSize: 14,
    color: colors.primary,
  },
  paginationButton: {
    color: colors.primary,
  },
  disabledButton: {
    color: colors.textLight,
  },
  topicItem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: colors.secondary,
    borderRadius: 15,
    width: '85%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicText: {
    fontSize: 16,
    color: colors.primary,
  },
  noResults: {
    fontSize: 16,
    color: '#FF0000',
    padding: 20,
    textAlign: 'center',
  },
  modalItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.textDark,
  },
  fullScreenCenteredView: {
    flex: 1,
  },
  modalView: {
    position: 'absolute',
    marginTop: -5,
    marginLeft: 50,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 15,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});

const InformationScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All Topics');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterIconPosition, setFilterIconPosition] = useState({ x: 0, y: 0 });
  const navigation = useNavigation();
  const filterIconRef = useRef(null);
  const { avatarUri } = useContext(UserContext);

  const masterDataSource = [
    { title: 'Learn More About Parkinson’s Disease' },
    { title: 'Symptoms of Parkinson’s Disease' },
    { title: 'Treatments for Parkinson’s Disease' },
    { title: 'Fall Prevention in Parkinson’s Disease' },
    { title: 'Getting Diagnosed of Parkinson’s Disease' },
    { title: 'Nutrition for Parkinson’s Disease' },
  ];

  const [filteredDataSource, setFilteredDataSource] = useState(masterDataSource);
  const topicsPerPage = 3;

  const filterOptions = ['All Topics', 'Symptoms', 'Treatments', 'Prevention'];

  const applyFilter = (searchText, filter) => {
    const filteredData = masterDataSource.filter(topic => {
      const topicLower = topic.title.toLowerCase();
      const searchLower = searchText.toLowerCase();
      return topicLower.includes(searchLower) &&
             (filter === 'All Topics' || topicLower.includes(filter.toLowerCase()));
    });

    setFilteredDataSource(filteredData);
    setCurrentPage(1);
  };

  const handleSearch = text => {
    setSearchQuery(text);
    applyFilter(text, selectedFilter);
  };

  const handleFilterPress = () => {
    filterIconRef.current.measureInWindow((x, y) => {
      setFilterIconPosition({ x, y });
      setModalVisible(true);
    });
  };

  const handleFilterSelection = option => {
    setSelectedFilter(option);
    applyFilter(searchQuery, option);
    setModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const totalPages = Math.max(Math.ceil(filteredDataSource.length / topicsPerPage), 1);
  const indexOfLastTopic = currentPage * topicsPerPage;
  const indexOfFirstTopic = indexOfLastTopic - topicsPerPage;
  const currentTopics = filteredDataSource.slice(indexOfFirstTopic, indexOfLastTopic);

  const nextPage = () => {
    setCurrentPage(current => Math.min(current + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(current => Math.max(current - 1, 1));
  };

  const noResultsMessage = searchQuery
    ? `No results for "${searchQuery}" in "${selectedFilter}".`
    : `No topics match your selected filter: "${selectedFilter}".`;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.ellipsesContainer}>
          <Image source={require('../../assets/images/ellipse1.png')} style={styles.ellipse} />
          <Image source={require('../../assets/images/ellipse2.png')} style={[styles.ellipse, styles.secondEllipsePosition]} />
        </View>
        <TouchableOpacity style={styles.avatarTouchable} onPress={() => navigation.navigate('AvatarPage')}>
          <Image
            source={avatarUri ? { uri: avatarUri } : require('../../assets/images/avatar.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.header}>Medical Information</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.black} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            ref={filterIconRef}
            onPress={handleFilterPress}
          >
            <Ionicons name="options" size={20} color={colors.black} style={styles.filterIcon} />
          </TouchableOpacity>
          <Text style={styles.selectedFilter}>{selectedFilter}</Text>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.fullScreenCenteredView}>
              <View style={[styles.modalView, { top: filterIconPosition.y + 40, left: filterIconPosition.x - 50 }]}>
                {filterOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalItem}
                    onPress={() => handleFilterSelection(option)}
                  >
                    <Text style={styles.modalItemText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {currentTopics.length > 0 ? (
          currentTopics.map((topic, index) => (
            <TouchableOpacity
              key={index}
              style={styles.topicItem}
              onPress={() => navigation.navigate('TopicDetailPage', { title: topic.title })}
            >
              <Text style={styles.topicText}>{topic.title}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResults}>{noResultsMessage}</Text>
        )}
        <View style={styles.paginationControls}>
          <TouchableOpacity onPress={prevPage} disabled={currentPage === 1}>
            <Ionicons name="chevron-back-circle-outline" size={30} color={currentPage === 1 ? colors.textLight : colors.primary} />
          </TouchableOpacity>
          <Text style={styles.pageNumber}>Page {Math.min(currentPage, totalPages)} of {totalPages}</Text>
          <TouchableOpacity onPress={nextPage} disabled={currentPage === totalPages || totalPages === 0}>
            <Ionicons name="chevron-forward-circle-outline" size={30} color={currentPage === totalPages || totalPages === 0 ? colors.textLight : colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Image
        source={require('../../assets/images/info.png')}
        style={styles.bottomImage}
      />
      <View style={styles.bottomBar}></View>
    </View>
  );
};

export default InformationScreen;
