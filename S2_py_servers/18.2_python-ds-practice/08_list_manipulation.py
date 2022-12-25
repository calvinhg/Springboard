def list_manipulation(lst, command, location, value=None):
    """Mutate lst to add/remove from beginning or end.

    - lst: list of values
    - command: command, either "remove" or "add"
    - location: location to remove/add, either "beginning" or "end"
    - value: when adding, value to add

    remove: remove item at beginning or end, and return item removed

        >>> lst = [1, 2, 3]

        >>> list_manipulation(lst, 'remove', 'end')
        3

        >>> list_manipulation(lst, 'remove', 'beginning')
        1

        >>> lst
        [2]

    add: add item at beginning/end, and return list

        >>> lst = [1, 2, 3]

        >>> list_manipulation(lst, 'add', 'beginning', 20)
        [20, 1, 2, 3]

        >>> list_manipulation(lst, 'add', 'end', 30)
        [20, 1, 2, 3, 30]

        >>> lst
        [20, 1, 2, 3, 30]

    Invalid commands or locations should return None:

        >>> list_manipulation(lst, 'foo', 'end') is None
        True

        >>> list_manipulation(lst, 'add', 'dunno') is None
        True
    """

    if command is not "add" and command is not "remove" or location is not "beginning" and location is not "end":
        return None

    location = -1 if location == "end" else 0

    if command is "add":
        if location:
            lst.append(value)
        else:
            lst.insert(location, value)
        return lst
    else:
        return lst.pop(location)


# print("remove")
# lst = [1, 2, 3]
# print(list_manipulation(lst, 'remove', 'end'))
# print(list_manipulation(lst, 'remove', 'beginning'))
# print(lst)

# print("\nadd")
# lst = [1, 2, 3]
# print(list_manipulation(lst, 'add', 'beginning', 20))
# print(list_manipulation(lst, 'add', 'end', 30))

# print("\ninvalid")
# print(list_manipulation(lst, 'foo', 'end'))
# print(list_manipulation(lst, 'add', 'dunno'))
