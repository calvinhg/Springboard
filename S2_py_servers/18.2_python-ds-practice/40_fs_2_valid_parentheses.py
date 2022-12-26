def valid_parentheses(parens):
    """Are the parentheses validly balanced?

        >>> valid_parentheses("()")
        True

        >>> valid_parentheses("()()")
        True

        >>> valid_parentheses("(()())")
        True

        >>> valid_parentheses(")()")
        False

        >>> valid_parentheses("())")
        False

        >>> valid_parentheses("((())")
        False

        >>> valid_parentheses(")()(")
        False
    """

    count_opens = 0
    for i in range(int(len(parens)/2+1)):
        # Counts open parens so there isn't a close before an open
        count_opens += 1 if parens[i] == "(" else -1
        # If parens are same: not symmetric
        if parens[i] == parens[-i-1]:
            return False
        if count_opens < 0:
            return False

    return True


# print(valid_parentheses("()"))
# print(valid_parentheses("()()"))
# print(valid_parentheses("(()())"))
# print(valid_parentheses(")()"))
# print(valid_parentheses("())"))
# print(valid_parentheses("((())"))
# print(valid_parentheses(")()("))
