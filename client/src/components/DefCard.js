import { useState, useEffect } from 'react';
import { Card, Text, Metric, Flex, ProgressBar } from "@tremor/react";

const DefCard = () => {
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/sales');
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="max-w-xs mx-auto">
      {salesData && (
        <>
          <Text>Sales</Text>
          <Metric>$ {salesData.salesAmount}</Metric>
          <Flex className="mt-4">
            <Text>{((salesData.salesAmount / salesData.annualTarget) * 100).toFixed(2)}% of annual target</Text>
            <Text>$ {salesData.annualTarget}</Text>
          </Flex>
          <ProgressBar value={(salesData.salesAmount / salesData.annualTarget) * 100} className="mt-2" />
        </>
      )}
    </Card>
  );
};

export default DefCard;
