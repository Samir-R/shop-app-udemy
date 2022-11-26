import styled from 'styled-components';

// export const DirectoryContainer = styled.div`
//   width: 100%;
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: space-between;
// `;

export const DirectoryLeftContainer = styled.div`
  float: left;
  border: 1px solid #ecf0f1;
  /* background-color: #f1f1f1; */
  width: 20%;
  /* min-width: 200px; */
  height: 700px;
  overflow: auto;
`;

export const DirectoryRightContainer = styled.div`
  float: left;
  border: 1px solid #ccc;
  /* background-color: #f1f1f1; */
  width: 80%;
  height: 700px;
  overflow: auto;
`;
