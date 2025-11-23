import type { Metadata } from 'next'

export const metadata:Metadata = {
    title: '404'
}

export default function NotFound() {
    return (
            <div className="flex flex-col items-center">
                <div className="max-w-2xl w-full text-center">
                    {/* 404 Number */}
                    <div className="mb-12 pt-8 max-w-7xl mx-auto select-none">
                        ERROR
                        <h1 className="text-5xl font-bold mb-4 tracking-tight text-balance">404</h1>
                    </div>

                    {/* Message */}
                    <h2 className="text-2xl font-medium mb-4 text-accent-dark">
                        There is nothing here!
                    </h2>
                    <p className="mb-12 max-w-md mx-auto text-accent-dark">
                        Check what you were trying to access.
                    </p>
                </div>
            </div>
    );
}