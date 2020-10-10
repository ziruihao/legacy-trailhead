import typedefs from '../constants/typedefs';

/**
 * Returns combined string of emails for a list of users.
 * @param {typedefs.User[]} people - List of users to extract emails from.
 * @returns {string} - Combines all emails into a single comma-separated string.
 */
// eslint-disable-next-line import/prefer-default-export
export const extractEmails = (people) => {
  let emails = '';
  people.forEach((pender) => {
    emails += `${pender.user.email}, `;
  });
  return emails.substring(0, emails.length - 2);
};
