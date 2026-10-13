function LanguageSelector({ language, setLanguage }) {
    return (
        <select
            className="cursor-pointer"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
        >
            <option value="cpp">
                C++
            </option>

            <option value="c">
                C
            </option>

            <option value="java">
                Java
            </option>

            <option value="python">
                Python
            </option>
        </select>
    );
}

export default LanguageSelector;