import React from "react";

const DescriptionBlocksEditor = ({ descriptionBlocks, setDescriptionBlocks }) => {
  const handleTextChange = (index, value) => {
    const updated = [...descriptionBlocks];
    updated[index].text = value;
    setDescriptionBlocks(updated);
  };

  const handleLayoutChange = (index, layout) => {
    const updated = [...descriptionBlocks];
    updated[index].layout = layout;
    setDescriptionBlocks(updated);
  };

  const handleImageChange = (index, file) => {
    const updated = [...descriptionBlocks];
    updated[index].file = file;
    updated[index].imagePreview = URL.createObjectURL(file);
    setDescriptionBlocks(updated);
  };

  const addBlock = () => {
   setDescriptionBlocks([
  ...descriptionBlocks,
  { text: "", layout: "leftToRight", file: null, imagePreview: null },
]);
  };

  const removeBlock = (index) => {
    const updated = [...descriptionBlocks];
    updated.splice(index, 1);
    setDescriptionBlocks(updated);
  };

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-xl font-semibold mb-4">Description Blocks</h3>
      {descriptionBlocks.map((block, idx) => (
        <div key={idx} className="flex flex-col gap-4 border border-gray-600 rounded-xl p-4 bg-[#1e1e1e]">
          <textarea
            placeholder="Description text"
            value={block.text}
            onChange={(e) => handleTextChange(idx, e.target.value)}
            className="w-full p-2 rounded bg-[#2c2c2c] text-white border border-gray-500"
          />

          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-300">Layout:</label>
            <select
              value={block.layout}
              onChange={(e) => handleLayoutChange(idx, e.target.value)}
              className="bg-[#2c2c2c] border border-gray-500 p-1 rounded text-white"
            >
              <option value="leftToRight">Left to Right</option>
              <option value="rightToLeft">Right to Left</option>
            </select>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(idx, e.target.files[0])}
            className="text-white"
          />

          {block.imagePreview && (
            <img src={block.imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
          )}

          <button
            type="button"
            onClick={() => removeBlock(idx)}
            className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
          >
            Remove Block
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addBlock}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Add Block
      </button>
    </div>
  );
};

export default DescriptionBlocksEditor;
