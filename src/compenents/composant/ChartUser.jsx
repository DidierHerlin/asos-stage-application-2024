import React, { useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function ChartUser() {
  useEffect(() => {
    const root = am5.Root.new("chart-user");

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        endAngle: 270
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category", // Use 'category' directly
        endAngle: 270
      })
    );

    series.states.create("hidden", {
      endAngle: -90
    });

    // Updated data with Employer and Admin
    series.data.setAll([
      { category: "Employer", value: 501.9 },
      { category: "Admin", value: 301.9 }
    ]);

    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div id="chart-user" className="w-full h-72"></div>
  );
}
