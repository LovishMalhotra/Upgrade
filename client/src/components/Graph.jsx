import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import "chart.js/auto";
import axios from 'axios';

const StackGraph = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/training/trainings/score-ranges");
        const scoreRanges = response.data;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');


        // Prepare chart data based on the API response
        const data = {
          labels: ['HackerRank Score', 'Assessment Score', 'Performance', 'Communication'],
          datasets: [
            {
              label: 'Scores 0-4',
              backgroundColor: documentStyle.getPropertyValue('--blue-500'),
              data: [
                scoreRanges.hackerRankScore['0-4'],
                scoreRanges.assessmentScore['0-4'],
                scoreRanges.performance['0-4'],
                scoreRanges.communication['0-4']
              ]
            },
            {
              label: 'Scores 4-7',
              backgroundColor: documentStyle.getPropertyValue('--green-500'),
              data: [
                scoreRanges.hackerRankScore['4-7'],
                scoreRanges.assessmentScore['4-7'],
                scoreRanges.performance['4-7'],
                scoreRanges.communication['4-7']
              ]
            },
            {
              label: 'Scores 7-10',
              backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
              data: [
                scoreRanges.hackerRankScore['7-10'],
                scoreRanges.assessmentScore['7-10'],
                scoreRanges.performance['7-10'],
                scoreRanges.communication['7-10']
              ]
            }
          ]
        };

        
        const options = {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            tooltips: {
              mode: 'index',
              intersect: false
            },
            legend: {
              labels: {
                color: textColor
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder
              }
            },
            y: {
              stacked: true,
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder
              }
            }
          }
        };

        setChartData(data);
        setChartOptions(options);
      } catch (error) {
        console.error("Error fetching score ranges:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card">
      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  );
};



const PieChart = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Fetch training session status counts from the backend
    axios.get('http://localhost:8080/training/trainings/status')
      .then(response => {
        const { completed, pending, ongoing } = response.data;
        
        const data = {
          labels: ['Completed', 'Pending', 'Ongoing'],
          datasets: [
            {
              data: [completed, pending, ongoing],
              backgroundColor: [
                getComputedStyle(document.documentElement).getPropertyValue('--green-500'),
                getComputedStyle(document.documentElement).getPropertyValue('--yellow-500'),
                getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
              ],
              hoverBackgroundColor: [
                getComputedStyle(document.documentElement).getPropertyValue('--green-400'),
                getComputedStyle(document.documentElement).getPropertyValue('--yellow-400'),
                getComputedStyle(document.documentElement).getPropertyValue('--blue-400'),
              ],
            }
          ]
        };

        const options = {
          cutout: '60%',
          plugins: {
            title: {
              display: true,
              text: 'Training Sessions Status',
              font: {
                size: 20,
                weight: 'bold',
              }
            }
          }
        };

        setChartData(data);
        setChartOptions(options);
      })
      .catch(error => {
        console.error('Error fetching training statuses:', error);
      });
  }, []);

  return (
    <div className="card">
      <Chart type="doughnut" data={chartData} options={chartOptions} />
    </div>
  );
};



export { StackGraph, PieChart };
