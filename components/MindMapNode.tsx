
import React from 'react';
import { MindMapNode as MindMapNodeType } from '../types';

interface MindMapNodeProps {
  node: MindMapNodeType;
}

const MindMapNode: React.FC<MindMapNodeProps> = ({ node }) => {
  return (
    <li className="mindmap-node">
      <div className="mindmap-topic">
        {node.topic}
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="mindmap-children">
          {node.children.map((child, index) => (
            <MindMapNode key={index} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default MindMapNode;
