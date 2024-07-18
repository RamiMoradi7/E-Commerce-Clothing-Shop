import React from "react";
import { ColorModel } from "../../../../Models/ColorModel";
import { ProductModel } from "../../../../Models/ProductModel";
import { Stock } from "../../../../types/Stock";

interface ColorSelectorProps {
  stock: Stock[];
  handleColorChange: (color: ColorModel) => void;
  selectedColor: ColorModel;
}

export default function ColorSelector({
  stock,
  handleColorChange,
  selectedColor,
}: ColorSelectorProps): JSX.Element {
  return (
    <>
      <h3 className="text-sm font-medium text-gray-900">
        Color : {selectedColor?.name}
      </h3>
      <div aria-label="Choose a color" className="mt-4">
        <div className="ml-4 flex items-center space-x-6">
          {stock.map((s, index) => (
            <React.Fragment key={index}>
              {stock.findIndex((item) => item.color._id === s.color._id) ===
                index && (
                <label
                  aria-label={s.color.name}
                  className={`relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none`}
                >
                  <input
                    type="radio"
                    name="color-choice"
                    value={s.color._id}
                    onClick={() => handleColorChange(s.color)}
                    className="sr-only"
                  />
                  <span
                    style={{
                      backgroundColor: s.color?.hex,
                    }}
                    aria-hidden="true"
                    className={`h-10 w-10 rounded-full border-2 ${
                      selectedColor?.name === s.color.name
                        ? "border-gray-900"
                        : "border-gray-300"
                    }`}
                  ></span>
                </label>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
