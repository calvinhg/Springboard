def remove_every_other(lst):
    """Return a new list of other item.

        >>> lst = [1, 2, 3, 4, 5]

        >>> remove_every_other(lst)
        [1, 3, 5]

    This should return a list, not mutate the original:

        >>> lst
        [1, 2, 3, 4, 5]
    """

    return [n for n in lst if lst.index(n) % 2 == 0]


# lst = [1, 2, 3, 4, 5]
# print(remove_every_other(lst), lst)
