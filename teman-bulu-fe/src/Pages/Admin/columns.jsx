export const tableColumnBuyer = [
  {
    name: 'Nama Lengkap',
    selector: row => row.full_name,
    sortable: true,
  },
  // {
  //   name: 'Username',
  //   selector: row => row.username,
  //   sortable: true,
  // },
  {
    name: 'Email',
    selector: row => row.email,
    sortable: true,
  },
];

export  const tableColumnSeller = [
  {
    name: 'Nama Lengkap',
    selector: row => row.full_name,
    sortable: true,
  },
  {
    name: 'Username',
    selector: row => row.username,
    sortable: true,
  },
  {
    name: 'Email',
    selector: row => row.email,
    sortable: true,
  },
  {
    name: 'Phone Number',
    selector: row => row.phone_number,
    sortable: true,
  },
  {
    name: 'Alamat',
    selector: row => row.address,
    sortable: true,
  },
];

export const customStyles = {
  tableWrapper: {
    style: {
      borderRadius: '1rem',
      overflow: 'hidden',
    },
  },
  table: {
    style: {
      backgroundColor: '#f3f4f6',
    },
  },
  headRow: {
    style: {
      backgroundColor: '#f3f4f6',
      fontWeight: 'bold',
    },
  },
  rows: {
    style: {
      backgroundColor: '#f3f4f6',
    },
  },
};
