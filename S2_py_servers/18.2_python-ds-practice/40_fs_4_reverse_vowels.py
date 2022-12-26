def reverse_vowels(s):
    """Reverse vowels in a string.

    Characters which are not vowels do not change position in string, but all
    vowels (y is not a vowel), should reverse their order.

    >>> reverse_vowels("Hello!")
    'Holle!'

    >>> reverse_vowels("Tomatoes")
    'Temotaos'

    >>> reverse_vowels("Reverse Vowels In A String")
    'RivArsI Vewols en e Streng'

    >>> reverse_vowels("aeiou")
    'uoiea'

    >>> reverse_vowels("why try, shy fly?")
    'why try, shy fly?''
    """

    s = list(s)
    # Make copy to compare from and change
    s_copy = s.copy()

    num_vowels = sum({char: s.count(char)
                     for char in s if char in "aeiouAEIOU"}.values())
    vowels_seen = 0

    for i in range(len(s)):
        if s[i] in "aeiouAEIOU":  # if vowel
            vowels_seen += 1
            # Iterate backwards through copy
            for j in range(len(s)-1, 0, -1):
                # Find first vowel from back
                if s_copy[j] in "aeiouAEIOU":
                    s[j] = s[i]  # Swap vowels
                    s[i] = s_copy[j]
                    # Replace vowel in copy so it get "skipped" next time
                    s_copy[j] = "y"
                    break
        # If half vowels seen, all have been swapped
        # except middle one that doesn't need to be
        if vowels_seen >= int(num_vowels/2):
            break

    return "".join(s)  # Turn list back into string


# print(reverse_vowels("Hello!"))
# print(reverse_vowels("Tomatoes"))
# print(reverse_vowels("Reverse Vowels In A String"))
# print(reverse_vowels("aeiou"))
# print(reverse_vowels("why try, shy fly?"))
