export default function TextInput({ prompt, placeholder, value, setValue, onChangeHandler, maxLength }) {
    return (
        <div>
            <label className="label mb-0 pb-0">
                <span className="label-text text-lg text-asu-maroon mb-0">{prompt}</span>
            </label>
            <input
                maxLength={maxLength ?? 10}
                value={value}
                onChange={(e) => {
                    setValue && setValue(e.target.value)
                    onChangeHandler && onChangeHandler(e.target.value)    
                }}
                type="text"
                placeholder={placeholder}
                className="text-lg placeholder:text-gray-500 text-asu-maroon input bg-white/25 input-bordered input-secondary w-full max-w-xs mb-5"
            />
        </div>
    );
}
