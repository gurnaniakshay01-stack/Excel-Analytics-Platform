import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  excelData: [],
  xAxis: null,
  yAxis: null,
  chartType: 'bar',
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setExcelData(state, action) {
      state.excelData = action.payload;
    },
    setXAxis(state, action) {
      state.xAxis = action.payload;
    },
    setYAxis(state, action) {
      state.yAxis = action.payload;
    },
    setChartType(state, action) {
      state.chartType = action.payload;
    },
    clearData(state) {
      state.excelData = [];
      state.xAxis = null;
      state.yAxis = null;
      state.chartType = 'bar';
    },
  },
});

export const { setExcelData, setXAxis, setYAxis, setChartType, clearData } = dataSlice.actions;

export default dataSlice.reducer;
