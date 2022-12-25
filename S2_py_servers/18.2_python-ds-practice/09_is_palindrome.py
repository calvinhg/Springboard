def is_palindrome(phrase):
    """Is phrase a palindrome?

    Return True/False if phrase is a palindrome (same read backwards and
    forwards).

        >>> is_palindrome('tacocat')
        True

        >>> is_palindrome('noon')
        True

        >>> is_palindrome('robert')
        False

    Should ignore capitalization/spaces when deciding:

        >>> is_palindrome('taco cat')
        True

        >>> is_palindrome('Noon')
        True
    """

    phrase = phrase.lower().replace(" ", "")

    # only need to check first half to second half
    for i in range(int(len(phrase)/2)):
        if phrase[i] is not phrase[-i-1]:
            return False

    return True


# print(is_palindrome("tacocat"))
# print(is_palindrome("noon"))
# print(is_palindrome("robert"))
# print(is_palindrome("taco cat"))
# print(is_palindrome("Noon"))
