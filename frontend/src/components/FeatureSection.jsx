import {PenBox,BookOpen,Layout, Rocket, Megaphone,BarChart2 } from 'lucide-react'
import React from 'react'

const FeatureSection = () => {
    return (
        <div id="featureSection" className='mt-20 border-neutral-800 min-h-[800px]'> {/* add border-b if u want*/}
            <div className='text-center'>
                <span className='bg-neutral-900 text-yellow-600 text-xl rounded-full font-medium px-2 py-1 uppercase'>FEATURE</span>
                <h2 className='text-3xl sm:text-5xl lg:6xl mt-10 lg:mt-20 tracking-wide'>
                    Easily craft
                    <span className='bg-gradient-to-r from-yellow-500 to-yellow-900 text-transparent bg-clip-text'>
                       {" "} your eBooks effortlessly
                    </span>
                </h2>
            </div>
            <div className='flex flex-wrap mt-10 lg:mt-20'>
                <div className='w-full sm:w-1/2 lg:w-1/3 '>

                {/*Icon with text*/}
                    <div className='flex'>
                        <div className='mx-6 h-10 w-10 p-2  bg-neutral-900 text-yellow-600 justify-center items-center rounded-full'>
                            <PenBox/>
                        </div>
                        <div>
                            <h5 className='mb-5 text-xl'>AI-Powered Writing</h5>
                            <p className='text-md p-4 mb-20 text-neutral-500'>Let AI handle the heavy lifting—generate entire chapters, summaries, or even full eBooks with minimal input. Perfect for authors, marketers, or entrepreneurs looking to scale their content creation without sacrificing quality.</p>
                        </div>
                    </div>
                </div>

                <div className='w-full sm:w-1/2 lg:w-1/3 '>
                    {/*Icon with text*/}
                    <div className='flex'>
                        <div className='mx-6 h-10 w-10 p-2  bg-neutral-900 text-yellow-600 justify-center items-center rounded-full'>
                            <BookOpen/>
                        </div>
                        <div>
                            <h5 className='mb-5 text-xl'>Automated Content Creation</h5>
                            <p className='text-md p-4 mb-20 text-neutral-500'>Effortlessly generate well-researched, high-quality eBooks tailored to your niche or genre. Whether it's fiction, non-fiction, or industry-specific guides, our AI ensures your content is rich, engaging, and informative.</p>
                        </div>
                    </div>
                </div>


                <div className='w-full sm:w-1/2 lg:w-1/3 '>
                    {/*Icon with text*/}
                    <div className='flex'>
                        <div className='mx-6 h-10 w-10 p-2  bg-neutral-900 text-yellow-600 justify-center items-center rounded-full'>
                            <Layout/>
                        </div>
                        <div>
                            <h5 className='mb-5 text-xl'>Professional Design Templates</h5>
                            <p className='text-md p-4 mb-20 text-neutral-500'>Choose from a vast library of professionally designed templates that are fully customizable. Whether you're designing for a business guide or a creative portfolio, our templates make your eBook look polished and ready for any audience.</p>
                        </div>
                    </div>
                </div>
                <div className='w-full sm:w-1/2 lg:w-1/3 '>
                    {/*Icon with text*/}
                    <div className='flex'>
                        <div className='mx-6 h-10 w-10 p-2  bg-neutral-900 text-yellow-600 justify-center items-center rounded-full'>
                            <Rocket/>
                        </div>
                        <div>
                            <h5 className='mb-5 text-xl'>Fast & Easy</h5>
                            <p className='text-md p-4 mb-20 text-neutral-500'>Turn your idea into a fully formatted, professional eBook in just minutes. No design or writing experience required—our platform is optimized for speed and simplicity, allowing you to publish and share faster than ever.</p>
                        </div>
                    </div>
                </div>
                <div className='w-full sm:w-1/2 lg:w-1/3 '>
                    {/*Icon with text*/}
                    <div className='flex'>
                        <div className='mx-6 h-10 w-10 p-2  bg-neutral-900 text-yellow-600 justify-center items-center rounded-full'>
                            <Megaphone/>
                        </div>
                        <div>
                            <h5 className='mb-5 text-xl'>Built-in Marketing Tools</h5>
                            <p className='text-md p-4 mb-20 text-neutral-500'>Promote your eBooks with integrated email marketing, landing pages, and social media campaigns—all from the same platform.</p>
                        </div>
                    </div>
                </div>
                <div className='w-full sm:w-1/2 lg:w-1/3 '>
                    {/*Icon with text*/}
                    <div className='flex'>
                        <div className='mx-6 h-10 w-10 p-2  bg-neutral-900 text-yellow-600 justify-center items-center rounded-full'>
                            <BarChart2/>
                        </div>
                        <div>
                            <h5 className='mb-5 text-xl'>Advanced Analytics & Insights</h5>
                            <p className='text-md p-4 mb-20 text-neutral-500'>Track your eBook's performance with detailed analytics. Monitor downloads, sales, engagement, and campaign success. Use data-driven insights to optimize your content and marketing strategy for better results.</p>
                        </div>
                    </div>
                </div>
                
                
            </div>

        </div>
    )
}

export default FeatureSection
