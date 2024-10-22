import React from "react";
import "./Header.scss";
import heroSectionSmallImage from "../../assets/images/hero-section-image-02.jpeg";

export default function Header() {
    return (
        <>
            <header className="grid md:grid-cols-12 justify-center align-middle hero-section">
                <div className="xl:col-span-6 lg:col-span-7 md:col-span-12 my-auto xl:px-20 lg:px-12 md:p-10 sm:p-5">
                    <div className="border-box">
                        <section className="header-box">
                            <h1 className="tracking-tight leading-[1.3]">Style that Speaks - For Him, Her, and Together</h1>
                            <p className="py-4">Explore our exclusive collection of trendy clothing for men, women, and couples. Redefine your wardrobe with outfits made to complement every style.</p>
                            <div className="flex">
                                <button className="shop-button-light me-4 lg:col-span-2">Shop Now</button>
                                <button className="discover-button-dark lg:col-span-2">Discover the Collection</button>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="xl:col-span-6 lg:col-span-5 lg:block lg:min-h-[550px] md:min-h-[450px] image-section hidden">
                    <img src={heroSectionSmallImage} alt="women lean on man's shoulder pose with beautiful skin and brown color clothes" />
                </div>
            </header>
        </>
    );
}
