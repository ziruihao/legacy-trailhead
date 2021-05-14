export const BACKEND_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090' : 'https://trailhead-server.herokuapp.com';
export const ROOT_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'http://doc.dartmouth.edu';

export const styleSheet = {
  color: {
    white: 'white',
    green1: '#E9F5EC',
    green: '#0CA074',
    green2: '#004F54',
    green3: '#033724',
    orange1: '#F5EBE9',
    orange: '#EE6E52',
    gray1: '#EDECEC',
    gray2: '#C4C4C4',
    gray3: '#909090',
    gray4: '#494c50',
  },
};

/**
 * Returns the appropriate CSS ID for the club name for trip card decals.
 * @param {string} clubName - Desired club name.
 * @returns {string} - CSS ID for the club.
 */
export const clubDictionary = (clubName) => {
  switch (clubName) {
    case 'Cabin and Trail':
      return 'cnt';
    case 'Women in the Wilderness':
      return 'wiw';
    case 'Surf Club':
      return 'surf';
    case 'Mountain Biking':
      return 'dmbc';
    case 'Winter Sports':
      return 'wsc';
    case 'Timber Team':
      return 'wood';
    case 'Mountaineering':
      return 'mountain';
    case 'Ledyard':
      return 'ledyard';
    default:
      return 'doc';
  }
};
