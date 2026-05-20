import React from "react";
import { Sankey, ResponsiveContainer, Tooltip } from "recharts";

// deterministic color from a string
function colorFromName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `hsl(${h}, 65%, 55%)`;
}

const CustomNode = (props) => {
  const { x, y, width, height, payload } = props;
  const fill = colorFromName(payload.name);

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={2} />
      <text
        x={x + width + 6}
        y={y + height / 2}
        dy={4}
        fontSize={14}
        fill="rgba(220, 230, 255, 0.75)"
        fontFamily="'Courier New', monospace"
        letterSpacing="0.04em"
      >
        {payload.name}
      </text>
    </g>
  );
};

const CustomLink = (props) => {
  const { sourceX, sourceY, targetX, targetY, sourceControlX, targetControlX, linkWidth, payload } = props;

  const stroke = colorFromName(payload.source.name); // color by source node

  const d = `
    M${sourceX},${sourceY}
    C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
  `;

  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeOpacity={0.4}
      strokeWidth={Math.max(1, linkWidth)}
    />
  );
};

export default function BudgetSankey({ data }) {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <Sankey
        data={data}
        nodeWidth={16}
        nodePadding={18}
        margin={{ top: 20, right: 200, bottom: 20, left: 20 }}
        node={<CustomNode />}
        link={<CustomLink />}
      >
        <Tooltip />
      </Sankey>
    </ResponsiveContainer>
  );
}
