export default function ForgotPassword() {
    return (
            <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1 className="text-3xl font-bold">Forgot Password Page</h1>
                <form className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    type="email"
                    placeholder="Email"
                    className="p-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                >
                    Send Reset Link
                </button>
                </form>
            </main>
            </div>
    )
}