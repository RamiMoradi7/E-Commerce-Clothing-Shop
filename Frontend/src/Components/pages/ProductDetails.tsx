import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ColorModel } from "../../Models/ColorModel";
import { ProductModel } from "../../Models/ProductModel";
import { SizeModel } from "../../Models/SizeModel";
import { productsService } from "../../Services/ProductsService";
import { notify } from "../../Utils/Notify";
import { useTitle } from "../../hooks/useTitle";
import { Stock } from "../../types/Stock";
import AddToBag from "../CartArea/Buttons/AddToBag/AddToBag";
import Loader from "../Common/Loader/Loader";
import ColorSelector from "../ProductsArea/ProductDetails/ColorSelector/ColorSelector";
import NavigationList from "../ProductsArea/ProductDetails/NavigationList/NavigationList";
import ProductImageGallery from "../ProductsArea/ProductDetails/ProductImageGallery/ProductImageGallery";
import ProductInfoSection from "../ProductsArea/ProductDetails/ProductInfoSection/ProductInfoSection";
import SizeSelector from "../ProductsArea/ProductDetails/SizeSelector/SizeSelector";

type Selection = {
  color: ColorModel | null;
  size: SizeModel | null;
  product: ProductModel | null;
};

export default function Details(): JSX.Element {
  useTitle("Details");
  const { _id } = useParams();
  const [product, setProduct] = useState<ProductModel>(null);
  const [selection, setSelection] = useState<Selection>(null);

  useEffect(() => {
    productsService
      .getProduct(_id)
      .then((product) => {
        setProduct(product);
      })
      .catch((err: any) => notify.error(err));
  }, [_id]);

  if (!product) {
    return <Loader />;
  }

  const handleColorChange = (color: ColorModel) => {
    setSelection({ color: color, product: null, size: null });
  };

  const handleSizeChange = (size: SizeModel, stock: Stock) => {
    setSelection({
      ...selection,
      size,
      product: { ...product, stock: [stock] },
    });
  };

  const { name, price, stock, imageUrls, description, discount } = product;
  return (
    <>
      <div className="bg-white p-2 ">
        <div className="pt-6">
          <NavigationList product={product} />
          <ProductImageGallery imageUrls={imageUrls} />
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
            <ProductInfoSection name={name} price={price} discount={discount} />
            <div className="mt-10 ml-7">
              <div>
                <ColorSelector
                  handleColorChange={handleColorChange}
                  stock={stock}
                  selectedColor={selection?.color}
                />
              </div>
              <div className="mt-10">
                <SizeSelector
                  handleSizeChange={handleSizeChange}
                  selectedColor={selection?.color}
                  selectedSize={selection?.size}
                  stock={stock}
                />
                <AddToBag product={selection?.product} />
              </div>
            </div>

            <div className="py-5 lg:col-span-3 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">
                  About {name}
                </h2>
                <div className="mt-4 space-y-6">
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
